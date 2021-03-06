import { validLang } from "../utils/lang";
import { runCompiler } from "./runCompiler";

export default async (req: any, res: any) => {
    const lang = req.query.language;
  const { code, timeout, input, testcases } = req.query;

  let language: validLang | undefined;

  switch (lang) {
    case 'python':
      language = 'python';
      break;
    case 'javascript':
      language = 'javascript';
      break;
    case 'cpp':
      language = 'cpp';
      break;
    default:
      language = undefined;
  }

  if (
    language &&
    typeof code === 'string' &&
    (typeof timeout === 'string' || typeof timeout === 'number') &&
    testcases
  ) {
    const result = await runCompiler(
      language,
      code,
      typeof timeout === 'string' ? parseInt(timeout) : timeout,
      undefined,
      testcases,
    );

    res.send(result).status(200);
  } else if (
    language &&
    typeof code === 'string' &&
    (typeof timeout === 'string' || typeof timeout === 'number') &&
    input
  ) {
    const result = await runCompiler(
      language,
      code,
      typeof timeout === 'string' ? parseInt(timeout) : timeout,
      input,
      undefined,
    );
    
    if (!Array.isArray(result)) {
      if (result.exitCode === 0) res.send(result).status(200);
      else res.send(result).status(result.exitCode);
    }
  } else res.sendStatus(404);
}