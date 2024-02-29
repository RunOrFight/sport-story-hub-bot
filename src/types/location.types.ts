export type TLocationCreatePayload = {
  title?: string;
  url?: string;
  address?: string;
  previewId?: number;
};

export type TLocationUpdatePayload = {
  id: number;
  title?: string | null;
  url?: string | null;
  address?: string | null;
  previewId?: number | null;
};

export type TLocationDeletePayload = {
  id: number;
};
