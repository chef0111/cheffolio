'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { resolveProjectName } from '../lib/command';
import { useCreate } from './create-provider';

export function CreateNameField() {
  const { projectName, setProjectName } = useCreate();

  return (
    <div className="flex flex-col gap-2 px-4 py-3">
      <Label htmlFor="create-project-name">Project name</Label>
      <Input
        id="create-project-name"
        name="projectName"
        value={projectName}
        onChange={(event) => {
          setProjectName(event.target.value);
        }}
        onBlur={() => {
          setProjectName(resolveProjectName(projectName));
        }}
        placeholder="my-app"
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
}
