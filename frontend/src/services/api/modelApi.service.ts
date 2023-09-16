import axios from "axios";

export class ModelApi<TModel, TModelCreate, TModelUpdate> {
  API_URL = "http://localhost:8000";

  constructor(protected endpoint: string) {}

  async get(data?: Partial<TModel>) {
    const queryString = data ? "?" + Object
        .entries(data)
        .map(([key, value]) => `${key}=${value}`)
        .join("&")
        : "";

    const response = await axios.get<TModel[]>(`${this.API_URL}${this.endpoint}/${queryString}`);
    return response.data;
  }

  async getById(id: number) {
    const response = await axios.get<TModel>(`${this.API_URL}${this.endpoint}/${id}`);
    return response.data;
  }

  async create(data: TModelCreate) {
    const response = await axios.post<TModel>(`${this.API_URL}${this.endpoint}`, data);
    return response.data;
  }

  async update(id: number, data: TModelUpdate) {
    const response = await axios.put<TModel>(`${this.API_URL}${this.endpoint}/${id}`, data);
    return response.data;
  }

  async delete(id: number) {
    const response = await axios.delete(`${this.API_URL}${this.endpoint}/${id}`);
    return response.data;
  }
}
