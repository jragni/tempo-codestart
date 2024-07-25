/**
 * AdminPage
 * TODO add error handling display
 */
"use client";
import { useState } from "react";
import { Select } from "@components";

import { Problem } from "@/app/containers/Workspace/definitions";

import { formOptions, formPropDictionary } from './constants';
import { Fields } from "./definitions";

export default function AdminPage({ problems }: { problems: Problem[] }) {
  const [form, setForm] = useState('create-problem');
  const [selectedProblem, setSelectedProblem] = useState<Problem>(problems[0]);

  const formProps = formPropDictionary[form];

  console.log(form)
  return (
    <div>
      <Select
        onChange={(e) => setForm(e.target.value)}
        className="w-full max-w-lg"
        options={formOptions}
        value={form}
      />
      {form === 'edit-problem' && (
        <Select
          onChange={(e) => setSelectedProblem(problems.filter(({ title }) => title === e.target.value)[0])}
          className="w-full max-w-lg"
          options={problems.map(({ title }) => ({ label: title, value: title }))}
          value={selectedProblem?.title}
        />
        )}
      <h1 className="text-2xl font-bold">{formProps.title}</h1>
      <form
        className="
        align-center
        bg-primary-content
        flex
        flex-col
        items-center
        justify-around
        w-100vw
        h-[calc(100dvh-64px)]
        "
        action={formProps.action}
      >
        {formProps.fields.map(({
          component,
					hidden=false,
          id,
          label,
          name,
          required=false,
          sublabel,
          type,
        }: Fields) => (
          <div hidden={hidden} key={`${label}-id-${id}-${name}-${component}`}>
            <label htmlFor={id}>{label}</label>
            {sublabel && <p>{sublabel}</p>}
            {component === 'textarea' ? (
              <textarea
                className="input input-bordered w-full max-w-lg"
                id={id}
                name={name}
                required={required}
                defaultValue={form === 'edit-problem' && problems.length && selectedProblem ? selectedProblem[name as keyof Problem] as string : ''}
								hidden={hidden}
              />
            ) : (
              <input
                className="input input-bordered w-full max-w-lg"
                type={type}
								hidden={hidden}
                id={id}
                name={name}
                required={required}
                defaultValue={form === 'edit-problem' && problems.length  && selectedProblem ? selectedProblem[name as keyof Problem] as string : ''}
              />
            )}
          </div>
        ))}
        <button className="btn btn-primary" type="submit">
          {formProps.submitText}
        </button>
      </form>
    </div>
  );
}
