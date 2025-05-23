// route('/projects/:projectId', './project.tsx')
import type { Route } from "./+types/aaa";
import { Form, Link } from "react-router";

export async function clientAction({ request }: Route.ClientActionArgs) {
  let formData = await request.formData();
  let title = formData.get("title");
  return { title };
}

export default function Project({ actionData }: Route.ComponentProps) {
  return (
    <div>
      <h1>Project</h1>
      <Form method="post">
        <input type="text" name="title" />
        <button type="submit">Submit</button>
      </Form>
      {actionData ? (
        <p>{(actionData.title as string) ?? "Title"} updated</p>
      ) : null}
      <Link to={`?$afafea=afafaw`} className="bg-red p-6">
        Fuck Off
      </Link>
    </div>
  );
}
