
/**
 * Extended HTMLInputElement interface to support directory upload attributes
 */
interface HTMLInputElement extends HTMLElement {
  webkitdirectory?: string;
  directory?: string;
}
