/* uds-react is consumed from its source clone through the `@uds` alias (see
   vite.config.ts). Its sources target a different tsconfig, so they are not
   type-checked here: the imports are typed as `any`. */
declare module '@uds/*'
