# Cognix Gateway

**Status: placeholder.**

The API Gateway is the single ingress for Cognix. It will be responsible for:

- Edge routing to the `web` and `api` services
- Authentication and token verification (`@cognix/auth`)
- Rate limiting and request shaping
- Observability (tracing, structured request logs)

No implementation is present yet — this package reserves the workspace slot and
documents the intended responsibilities so downstream work has a home.
