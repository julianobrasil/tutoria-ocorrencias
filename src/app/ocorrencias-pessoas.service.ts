import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {PessoaServiceAdapter} from './ocorrencias/public_api';

import {UsuarioService} from './model/servicos/dao/usuario.service';

import {PaginaDeResposta} from './model/servicos/classes';
import {ObjectReference} from './model/transport-objects';

@Injectable({providedIn: 'root'})
export class OcorrenciasPessoasAdapterService implements PessoaServiceAdapter {
  constructor(private _usuarioService: UsuarioService) {}

  /**
   * Obtém Usuários paginados
   *
   * @param {number} pagina
   * @param {number} tamanhoDaPagina
   * @param {string} valor
   * @returns {Observable<ObjectReference[]>}
   * @memberof OcorrenciasPessoasAdapterService
   */
  obtemPessoas(
    pagina: number,
    tamanhoDaPagina: number,
    valor: string,
  ): Observable<ObjectReference[]> {
    return this._usuarioService
      .obtemUsuariosPaginadosPorParteDoNome(tamanhoDaPagina, pagina, valor)
      .pipe(map((resposta: PaginaDeResposta<ObjectReference>) => resposta.content));
  }
}
