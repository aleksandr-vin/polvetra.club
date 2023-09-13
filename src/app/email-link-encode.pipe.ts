// email-link-encode.pipe.ts

import { NgModule, Pipe, PipeTransform } from '@angular/core';
/*
 * Encode mailto: link
 * Usage:
 *   "mailto:user@host.local?subject=My email&body=Some plain text" | emailLinkEncode
 */
@Pipe({ name: 'emailLinkEncode' })
export class EmailLinkEncodePipe implements PipeTransform {
  transform(value: string): string {
    return encodeURI(value);
  }
}

@NgModule({
  declarations: [EmailLinkEncodePipe],
  exports: [EmailLinkEncodePipe],
})
export class EncodeURIComponentPipeModule {}
