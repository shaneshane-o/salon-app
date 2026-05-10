'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../src/lib/supabase'

type Tool = {
  id: number
  name: string
  assigned_to: string
}

export default function Home() {
  const [tools, setTools] = useState<Tool[]>([])
  const [toolName, setToolName] = useState('')

  async function fetchTools() {
    const { data, error } = await supabase.from('tools').select('*')

    if (error) {
      alert(error.message)
      return
    }

    setTools(data || [])
  }

  useEffect(() => {
    fetchTools()
  }, [])

  async function addTool() {
    if (!toolName.trim()) return

    const { error } = await supabase.from('tools').insert([
      {
        name: toolName,
        assigned_to: 'Unassigned',
      },
    ])

    if (error) {
      alert(error.message)
      return
    }

    setToolName('')
    fetchTools()
  }

  async function deleteTool(id: number) {
    const { error } = await supabase.from('tools').delete().eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    fetchTools()
  }

  async function updateToolAssignment(id: number, assignedTo: string) {
    const { error } = await supabase
      .from('tools')
      .update({ assigned_to: assignedTo })
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    fetchTools()
  }

  return (
    <main className="p-10 max-w-xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Tool Tracker</h1>

      <div className="flex gap-2 mb-6">
        <input
          value={toolName}
          onChange={(e) => setToolName(e.target.value)}
          placeholder="Enter tool name"
          className="border p-2 rounded w-full"
        />

        <button
          onClick={addTool}
          className="bg-black text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      <div className="space-y-4">
        {tools.map((tool) => (
          <div key={tool.id} className="border rounded p-4 space-y-3">
            <div className="font-bold">{tool.name}</div>

            <div>Assigned To: {tool.assigned_to}</div>

            <div className="flex gap-2">
              <button
                onClick={() => updateToolAssignment(tool.id, 'Shane')}
                className="border px-3 py-1 rounded"
              >
                Assign to Shane
              </button>

              <button
                onClick={() => updateToolAssignment(tool.id, 'Unassigned')}
                className="border px-3 py-1 rounded"
              >
                Mark Unassigned
              </button>

              <button
                onClick={() => deleteTool(tool.id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}