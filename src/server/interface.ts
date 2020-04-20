import { DefaultContext, DefaultState, ParameterizedContext } from 'koa';

export type Context = ParameterizedContext<DefaultState, DefaultContext>;
