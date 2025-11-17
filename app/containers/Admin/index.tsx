/**
 * AdminPage
 */
"use client";
import { useState, useMemo } from "react";

import { Problem } from "@/app/containers/Workspace/definitions";
import { Select } from "@components";

import { formDictionary, formOptions, formPropDictionary } from './constants';

export default function AdminPage({ problems }: { problems: Problem[] }) {
  const [form, setForm] = useState('create-problem');

  const FormToRender = formDictionary[form];

  // Calculate statistics
  const stats = useMemo(() => {
    const totalProblems = problems.length;
    const byDifficulty = problems.reduce((acc, p) => {
      const diff = p.difficulty || 'Unknown';
      acc[diff] = (acc[diff] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byTopic = problems.reduce((acc, p) => {
      const topic = p.topic || 'Other';
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { totalProblems, byDifficulty, byTopic };
  }, [problems]);

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-2">Admin Dashboard</h1>
          <p className="text-base-content/70">Manage coding problems and content</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-title">Total Problems</div>
              <div className="stat-value text-primary">{stats.totalProblems}</div>
              <div className="stat-desc">All difficulties</div>
            </div>
          </div>

          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-title">Easy</div>
              <div className="stat-value text-success">{stats.byDifficulty.Easy || 0}</div>
              <div className="stat-desc">Beginner level</div>
            </div>
          </div>

          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-title">Medium</div>
              <div className="stat-value text-warning">{stats.byDifficulty.Medium || 0}</div>
              <div className="stat-desc">Intermediate level</div>
            </div>
          </div>

          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-title">Hard</div>
              <div className="stat-value text-error">{stats.byDifficulty.Hard || 0}</div>
              <div className="stat-desc">Advanced level</div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="card-title text-2xl">Problem Management</h2>
              <Select
                onChange={(e) => setForm(e.target.value)}
                className="select-bordered max-w-xs"
                options={formOptions}
                value={form}
              />
            </div>
            <div className="divider"></div>
            <FormToRender problems={problems} />
          </div>
        </div>
      </div>
    </div>
  );
}
