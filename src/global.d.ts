namespace NodeJS {
  interface ProcessEnv {
    TELEGRAM_BOT_ACCESS_TOKEN?: string;
    WEB_APP_URL?: string;
    EXPRESS_APP_PORT?: string;
  }
}

export declare global {
  interface JSON {
    parse(text: string, reviver?: (key: any, value: any) => any): unknown;
  }

  interface ArrayConstructor {
    isArray(a: unknown): a is unknown[];
  }

  interface Body {
    json(): Promise<unknown>;
  }
}
