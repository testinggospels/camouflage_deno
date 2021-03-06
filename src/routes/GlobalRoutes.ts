import { Opine, Request, Response } from "https://deno.land/x/opine@1.3.3/mod.ts";
import { CamouflageResponse } from "../models/CamouflageModels.ts";
import Parser from "../parser/ParserDefinition.ts";
import * as log from "https://deno.land/std@0.95.0/log/mod.ts";

export default class GlobalRoutes {
  private app: Opine;
  private mocksDir: string;
  private logger: log.Logger;
  constructor(app: Opine, mocksDir: string, logger: log.Logger) {
    this.app = app;
    this.mocksDir = mocksDir;
    this.logger = logger;
  }
  defineGlobalRoutes = () => {
    this.app.get("*", async (req: Request, res: Response) => {
      const data = new Uint8Array(<number>req.contentLength);
      await req.body.read(data);
      let body = await new TextDecoder().decode(data);
      body = IsJsonString(body) && req.contentLength !== null ? JSON.parse(body) : body;
      const parser: Parser = new Parser(req, body, this.mocksDir, this.logger);
      const mockFile: string = parser.getMatchedDir() + "/GET.mock";
      const response: CamouflageResponse = await parser.getResponse(mockFile);
      const headers = response.headers;
      Object.keys(headers).forEach((headerKey) => {
        res.append(headerKey, headers[headerKey]);
      });
      res.setStatus(parseInt(response.status));
      res.send(response.body);
    });

    this.app.post("*", async (req: Request, res: Response) => {
      const data = new Uint8Array(<number>req.contentLength);
      await req.body.read(data);
      let body = await new TextDecoder().decode(data);
      body = IsJsonString(body) ? JSON.parse(body) : body;
      const parser: Parser = new Parser(req, body, this.mocksDir, this.logger);
      const mockFile: string = parser.getMatchedDir() + "/POST.mock";
      const response: CamouflageResponse = await parser.getResponse(mockFile);
      const headers = response.headers;
      Object.keys(headers).forEach((headerKey) => {
        res.append(headerKey, headers[headerKey]);
      });
      res.setStatus(parseInt(response.status));
      res.send(response.body);
    });

    this.app.put("*", async (req: Request, res: Response) => {
      const data = new Uint8Array(<number>req.contentLength);
      await req.body.read(data);
      let body = await new TextDecoder().decode(data);
      body = IsJsonString(body) ? JSON.parse(body) : body;
      const parser: Parser = new Parser(req, body, this.mocksDir, this.logger);
      const mockFile: string = parser.getMatchedDir() + "/PUT.mock";
      const response: CamouflageResponse = await parser.getResponse(mockFile);
      const headers = response.headers;
      Object.keys(headers).forEach((headerKey) => {
        res.append(headerKey, headers[headerKey]);
      });
      res.setStatus(parseInt(response.status));
      res.send(response.body);
    });

    this.app.delete("*", async (req: Request, res: Response) => {
      const data = new Uint8Array(<number>req.contentLength);
      await req.body.read(data);
      let body = await new TextDecoder().decode(data);
      body = IsJsonString(body) ? JSON.parse(body) : body;
      const parser: Parser = new Parser(req, body, this.mocksDir, this.logger);
      const mockFile: string = parser.getMatchedDir() + "/DELETE.mock";
      const response: CamouflageResponse = await parser.getResponse(mockFile);
      const headers = response.headers;
      Object.keys(headers).forEach((headerKey) => {
        res.headers?.delete(headerKey);
        res.headers?.set(headerKey, headers[headerKey]);
      });
      res.setStatus(parseInt(response.status));
      res.send(response.body);
    });
  };
}
function IsJsonString(str: string): boolean {
  try {
    JSON.parse(str);
  } catch (_) {
    return false;
  }
  return true;
}
