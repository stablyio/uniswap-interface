/**
 * @generated SignedSource<<6b150990b036f419082e2630f2a0b7ea>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type Chain = "ARBITRUM" | "ETHEREUM" | "ETHEREUM_GOERLI" | "OPTIMISM" | "POLYGON" | "%future added value";
export type topTokensQuery$variables = {};
export type topTokensQuery$data = {
  readonly topTokenProjects: ReadonlyArray<{
    readonly logoUrl: string | null;
    readonly name: string | null;
    readonly tokens: ReadonlyArray<{
      readonly address: string | null;
      readonly chain: Chain;
      readonly decimals: number | null;
      readonly name: string | null;
      readonly symbol: string | null;
    }>;
  } | null> | null;
};
export type topTokensQuery = {
  response: topTokensQuery$data;
  variables: topTokensQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "orderBy",
    "value": "MARKET_CAP"
  },
  {
    "kind": "Literal",
    "name": "page",
    "value": 1
  },
  {
    "kind": "Literal",
    "name": "pageSize",
    "value": 100
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "logoUrl",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "address",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "decimals",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "symbol",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "topTokensQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "TokenProject",
        "kind": "LinkedField",
        "name": "topTokenProjects",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Token",
            "kind": "LinkedField",
            "name": "tokens",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v1/*: any*/),
              (v6/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": "topTokenProjects(orderBy:\"MARKET_CAP\",page:1,pageSize:100)"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "topTokensQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "TokenProject",
        "kind": "LinkedField",
        "name": "topTokenProjects",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Token",
            "kind": "LinkedField",
            "name": "tokens",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v1/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/)
            ],
            "storageKey": null
          },
          (v7/*: any*/)
        ],
        "storageKey": "topTokenProjects(orderBy:\"MARKET_CAP\",page:1,pageSize:100)"
      }
    ]
  },
  "params": {
    "cacheID": "7b9c2350a3d7478340d6aadac419764c",
    "id": null,
    "metadata": {},
    "name": "topTokensQuery",
    "operationKind": "query",
    "text": "query topTokensQuery {\n  topTokenProjects(orderBy: MARKET_CAP, page: 1, pageSize: 100) {\n    name\n    logoUrl\n    tokens {\n      chain\n      address\n      decimals\n      name\n      symbol\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "d90b6ecdd0c0ef07e49a1296c6202f29";

export default node;
