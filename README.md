# sample-multiple-nest-http-auths

## Overview

This repo is a sample of customized @nest/axios module which is manages different types of authorizations such as 
- API Keys
- Auth0 M2M
- AWS sig4

## Document

An article which explains this repo.  
[Manage multiple @nest/http auth methods](https://maclt.substack.com/p/manage-multiple-nesthttp-auth-methods?r=2p2und)

## Description

Suppose your product is designed using a microservices architecture and uses NestJS for the Backend for Frontend (BFF). Due to its role, the BFF interacts with multiple services, which can include both internal servers and third-party SaaS providers. As a result, managing different types of authorizations simultaneously becomes essential.

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
