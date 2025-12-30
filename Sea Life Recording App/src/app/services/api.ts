import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import type { MarineRecord } from "../components/RecordForm";

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-aee6fb1a`;

const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${publicAnonKey}`,
};

export async function fetchRecords(): Promise<MarineRecord[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/records`, {
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error fetching records:", error);
      throw new Error(error.error || "Failed to fetch records");
    }

    const data = await response.json();
    return data.records || [];
  } catch (error) {
    console.error("Error in fetchRecords:", error);
    throw error;
  }
}

export async function createRecord(
  record: Omit<MarineRecord, "id">
): Promise<MarineRecord> {
  try {
    const response = await fetch(`${API_BASE_URL}/records`, {
      method: "POST",
      headers,
      body: JSON.stringify(record),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error creating record:", error);
      throw new Error(error.error || "Failed to create record");
    }

    const data = await response.json();
    return data.record;
  } catch (error) {
    console.error("Error in createRecord:", error);
    throw error;
  }
}

export async function deleteRecord(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/records/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error deleting record:", error);
      throw new Error(error.error || "Failed to delete record");
    }
  } catch (error) {
    console.error("Error in deleteRecord:", error);
    throw error;
  }
}
