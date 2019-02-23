import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {CentroDeCustoService} from './dao/centro-de-custo.service';
import {ConfiguracoesService} from './dao/configuracoes.service';
import {TipoEventoService} from './dao/tipo-evento.service';
import {TutoriaService} from './dao/tutoria.service';
import {UsuarioService} from './dao/usuario.service';
import {InitService} from './init.service';
import {RelatoriosService} from './relatorios.service';

@NgModule({
  imports: [CommonModule],
  declarations: [],
  providers: [
    ConfiguracoesService,
    TutoriaService,
    UsuarioService,
    TipoEventoService,
    CentroDeCustoService,
    RelatoriosService,
    InitService,
  ],
})
export class ServicosModule {}
