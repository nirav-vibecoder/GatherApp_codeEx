export type EventRecord = {
  id: string;
  event_name: string;
  cca: string;
  event_date: string;
  start_time: string;
  end_time: string | null;
  location: string;
  registration_link: string | null;
  description: string | null;
  speaker: string | null;
  created_at?: string;
  updated_at?: string;
};

export type EventInput = Omit<EventRecord, 'id' | 'created_at' | 'updated_at'>;

export type ValidationIssue = {
  row: number;
  message: string;
};
