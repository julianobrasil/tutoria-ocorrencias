export class PaginaDeResposta<T> {
  constructor(
    public content: T[],
    public totalPages: number,
    public totalElements: number,
    public last: boolean,
    public size: number,
    public number: number,
    public sort: string,
    public numberOfElements: number,
    public first: boolean,
  ) {
    // this.content = [];
  }
}
