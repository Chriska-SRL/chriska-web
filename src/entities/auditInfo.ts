type AuditUser = {
  id: number;
  username: string;
};

type AuditEntry = {
  at: string;
  by: AuditUser;
  location: string;
};

export type AuditInfo = {
  created: AuditEntry;
  updated: AuditEntry;
  deleted: AuditEntry;
};
