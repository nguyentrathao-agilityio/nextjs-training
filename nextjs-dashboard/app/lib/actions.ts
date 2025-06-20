"use server";
import { z } from "zod";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string().min(1, "Customer ID is required"),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  status: z.enum(["pending", "paid"], {
    errorMap: () => ({ message: "Status must be either 'pending' or 'paid'" }),
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type InvoiceFormState = {
  id?: string;
  success: boolean;
  message: string;
  errors: {
    [key: string]: string[] | undefined;
  };
};

export async function createInvoice(
  _state: InvoiceFormState,
  formData: FormData
): Promise<InvoiceFormState> {
  try {
    const rawFormData = Object.fromEntries(formData.entries());
    const { customerId, amount, status } = CreateInvoice.parse(rawFormData);

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split("T")[0];

    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (err) {
    if (err instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        errors: err.flatten().fieldErrors,
      };
    }
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      errors: {},
    };
  }

  revalidatePath("/dashboard/invoices");
  return redirect("/dashboard/invoices");
}

export async function updateInvoice(
  state: InvoiceFormState,
  formData: FormData
): Promise<InvoiceFormState> {
  try {
    const rawFormData = Object.fromEntries(formData.entries());
    const { customerId, amount, status } = UpdateInvoice.parse(rawFormData);

    const amountInCents = amount * 100;

    if (state?.id) {
      await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${state?.id}
    `;
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        errors: err.flatten().fieldErrors,
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      errors: {},
    };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath("/dashboard/invoices");
}
