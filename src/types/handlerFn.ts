import express from 'express';

export type HandlerFn = (req: express.Request, res: express.Response) => void;
