import { handleCreateProblem, handleUpdateProblem } from "app/admin/actions";
import { FormProps } from "./definitions";

export const formOptions = [
  { label: "Create Problem", value: "create-problem" },
  { label: "Edit Problem", value: "edit-problem" },
];

export const formPropDictionary: Record<string, FormProps> = {
  "create-problem": {
    action: async (formData: FormData) => await handleCreateProblem(formData),
    title: "Create Problem",
    submitText: "Create Problem",
    fields: [
      {
        component: "input",
        id: "slug",
        label: "slug",
        name: "slug",
        required: true,
        sublabel: "e.g. something-like-this",
        type: "text",
      },
      {
        component: "input",
        id: "title",
        label: "Title",
        name: "title",
        required: true,
        type: "text",
      },
      {
        component: "textarea",
        id: "description",
        label: "Description",
        name: "description",
        required: true,
        type: "text",
      },
      {
        component: "textarea",
        id: "starterCode",
        label: "Starter Code",
        name: "starterCode",
        required: true,
        type: "text",
      },
      {
        component: "textarea",
        id: "solution",
        label: "Solution",
        name: "solution",
        required: false,
        type: "text",
      },
      {
        component: "textarea",
        id: "testCode",
        label: "Test Code",
        name: "testCode",
        type: "text",
        required: false,
      },
      {
        component: "input",
        id: "topic",
        label: "Topic",
        name: "topic",
        required: false,
        type: "text",
      },
    ],
  },
  "edit-problem": {
    action: async (formData: FormData) => await handleUpdateProblem(formData),
    title: "Edit Problem",
    submitText: "Submit Edit",
    fields: [
      {
        component: "input",
        id: "slug",
        label: "slug",
        name: "slug",
        required: true,
        sublabel: "e.g. something-like-this",
        type: "text",
      },
      {
        component: "input",
        id: "title",
        label: "Title",
        name: "title",
        required: false,
        type: "text",
      },
      {
        component: "textarea",
        id: "description",
        label: "Description",
        name: "description",
        required: true,
        type: "text",
      },
      {
        component: "textarea",
        id: "starterCode",
        label: "Starter Code",
        name: "starterCode",
        required: true,
        type: "text",
      },
      {
        component: "textarea",
        id: "testCode",
        label: "Test Code",
        name: "testCode",
        type: "text",
        required: false,
      },
      {
        component: "textarea",
        id: "solution",
        label: "Solution",
        name: "solution",
        required: false,
        type: "text",
      },
      {
        component: "input",
        id: "topic",
        label: "Topic",
        name: "topic",
        required: false,
        type: "text",
      },
      {
        component: "input",
        hidden: true,
        id: "id",
        label: "id",
        name: "id",
        required: true,
        type: "text",
      }
    ],
  }
};