// Owners cannot contain dots or slashes. Reject the special . and .. repo paths.
export const repositoryIdPattern =
  /^[a-zA-Z0-9][a-zA-Z0-9-]*\/(?!\.{1,2}$)[a-zA-Z0-9_.-]+$/;
