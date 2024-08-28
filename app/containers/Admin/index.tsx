/**
 * AdminPage
 * TODO add error handling display
 */
"use client";
import { useState } from "react";

import { Problem } from "@/app/containers/Workspace/definitions";
import { Select } from "@components";

import { formDictionary, formOptions, formPropDictionary } from './constants';

export default function AdminPage({ problems }: { problems: Problem[] }) {
  const [form, setForm] = useState('create-problem');

  const FormToRender = formDictionary[form];

  return (
    <div>
      <Select
        onChange={(e) => setForm(e.target.value)}
        className="w-full max-w-lg"
        options={formOptions}
        value={form}
      />
      <FormToRender problems={problems} />
    </div>
  );
}
