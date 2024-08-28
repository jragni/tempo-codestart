/**
 * EditProblemForm
 */
"use client";
import { useEffect, useState } from "react";
import { handleUpdateProblem } from "@/app/admin/actions";
import { Problem } from "@/app/containers/Workspace/definitions";
import { Select } from "@components";

export default function EditProblemForm({
  problems,
}: {
  problems: Problem[];
}) {
  const [selectedProblem, setSelectedProblem] = useState(
    problems.find(({ id }) => Number(id) == 1)
    || problems[0]
  );
  const [formValues, setFormValues] = useState(selectedProblem);

  useEffect(() => {
    setFormValues({ ...selectedProblem });
  }, [selectedProblem]);

  return (
    <div>
      <Select
        onChange={(e) => {
          setSelectedProblem(problems.find(({ id }) => id == e.target.value) || problems[0]);
        }}
        className="w-full max-w-lg"
        options={problems.map(({ id, title }) => ({ label: title, value: id }))}
        value={selectedProblem.id}
      />
      <h1 className="text-xl bold">Edit Problem Form</h1>
      <h2 className="text-lg bold">Problem Title: {selectedProblem.title}</h2>
      <h2 className="text-lg bold">ID: {selectedProblem.id}</h2>
      <form action={handleUpdateProblem}>
        <div>
          <label htmlFor="slug">Slug</label>
          <p className="text-sm">example: something-like-this</p>
          <input
            className="input input-bordered w-full max-w-lg"
            name="slug"
            required
            onChange={(e) => setFormValues({ ...formValues, slug: e.target.value })}
            value={formValues.slug}
          />
        </div>
        <div>
          <label htmlFor="title">Title</label>
          <input
            className="input input-bordered w-full max-w-lg"
            name="title"
            required
            onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
            value={formValues.title}
          />
        </div>
        <div>
          <label htmlFor="description">description</label>
          <textarea
            className="input input-bordered w-full max-w-lg"
            name="description"
            required
            onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
            value={formValues.description}
          />
        </div>
        <div>
          <label htmlFor="starterCode">Starter Code</label>
          <textarea
            className="input input-bordered w-full max-w-lg"
            name="starterCode"
            onChange={(e) => setFormValues({ ...formValues, starterCode: e.target.value })}
            required
            value={formValues.starterCode}
          />
        </div>
        <label htmlFor="testCode">Test Code</label>
        <textarea
          className="input input-bordered w-full max-w-lg"
          name="testCode"
          onChange={(e) => setFormValues({ ...formValues, testCode: e.target.value })}
          value={formValues.testCode}
        />
        <div>
          <label htmlFor="solution">Solution</label>
          <textarea
            className="input input-bordered w-full max-w-lg"
            name="solution"
            onChange={(e) => setFormValues({ ...formValues, solution: e.target.value })}
            value={formValues.solution}
          />
        </div>
        <div>
          <label htmlFor="topic">Topic</label>
          <input
            className="input input-bordered w-full max-w-lg"
            name="topic"
            onChange={(e) => setFormValues({ ...formValues, topic: e.target.value })}
            value={formValues.topic}
          />
        </div>
        <div>
          <label htmlFor="id">ID</label>
          <input
            className="input input-bordered w-full max-w-lg"
            name="id"
            readOnly
            value={formValues.id}
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Submit Update
        </button>
      </form>
    </div>
  );
}
