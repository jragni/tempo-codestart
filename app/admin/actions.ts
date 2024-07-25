/**
 * admin actions
 */
"use server";
import { FormEventHandler } from "react";
import { createProblem, updateProblem } from "../api/problems/handlers";

export const handleCreateProblem = async (formData: FormData) => {
  try {
    const problem = await createProblem({
      description: formData.get("description") as string,
      slug: formData.get("slug") as string,
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
}

export const handleUpdateProblem = async (formData: FormData) => {
  try {
    const problem = await updateProblem({
      description: formData.get("description") as string,
      slug: formData.get("slug") as string,
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
}
