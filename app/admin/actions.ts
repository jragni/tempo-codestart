/**
 * admin actions
 */
"use server";
import { revalidatePath } from "next/cache";
import { createProblem, updateProblem } from "../api/problems/handlers";
import { redirect } from "next/navigation";

export const handleCreateProblem = async (formData: FormData) => {
  try {
    const problem = await createProblem({
      description: formData.get("description") as string,
      slug: formData.get("slug") as string,
      solution: formData.get("solution") as string,
      starterCode: formData.get("starterCode") as string,
      testCode: formData.get("testCode") as string,
      title: formData.get("title") as string,
      topic: formData.get("topic") as string,
    });
    console.log('problem created:', problem);
  } catch (e) {
    console.log("Error creating problem=========");
    console.error(e);
  }
  revalidatePath("/admin");
  revalidatePath("/problems/[slug]");
}

export const handleUpdateProblem = async (formData: FormData) => {
  try {
    console.log('================== handleUpdateProblem ==================');
    console.log('formData:', formData);
    console.log('formData.get("id"):', formData.get("id"));
    const problem = await updateProblem({
      description: formData.get("description") as string,
      id: formData.get("id") as number | string,
      slug: formData.get("slug") as string,
      solution: formData.get("solution") as string,
      starterCode: formData.get("starterCode") as string,
      testCode: formData.get("testCode") as string,
      title: formData.get("title") as string,
      topic: formData.get("topic") as string,
    });
    console.log('problem updated:', problem);
  } catch (e) {
    console.log("Error creating problem=========");
    console.error(e);
  }
  revalidatePath("/admin");
  redirect("/admin");
}
