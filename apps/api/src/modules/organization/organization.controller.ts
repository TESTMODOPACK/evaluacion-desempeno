import { Controller, Get } from '@nestjs/common';

@Controller({ path: 'organizations', version: '1' })
export class OrganizationController {
  @Get('me')
  me() {
    return { id: 'org-demo', name: 'Organizacion Demo', locale: 'es-ES' };
  }
}
