import { defineStore } from "pinia";

interface DocumentState {
  documentData: any | null;
}

export const useDocumentStore = defineStore("document", {
  state: (): DocumentState => ({
    documentData: null,
  }),
  actions: {
    setDocumentData(documentData: any) {
      this.documentData = documentData;
    },
    clearDocumentData() {
      this.documentData = null;
    },
  },
});
