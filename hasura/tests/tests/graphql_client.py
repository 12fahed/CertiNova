from dataclasses import dataclass
from typing import Any

import httpx

JSON = dict[str, Any]


class GraphQLError(AssertionError):
    def __init__(self, errors: list[JSON]) -> None:
        self.errors = errors
        super().__init__("; ".join(str(e.get("message")) for e in errors))


@dataclass
class GraphQLClient:
    url: str
    headers: dict[str, str]

    def execute(self, query: str, variables: JSON | None = None) -> JSON:
        response = httpx.post(
            self.url,
            json={"query": query, "variables": variables or {}},
            headers=self.headers,
            timeout=10,
        )
        response.raise_for_status()
        body: JSON = response.json()
        return body

    def data(self, query: str, variables: JSON | None = None) -> JSON:
        body = self.execute(query, variables)
        if "errors" in body:
            raise GraphQLError(body["errors"])
        data: JSON = body["data"]
        return data

    def error_codes(self, query: str, variables: JSON | None = None) -> list[str]:
        body = self.execute(query, variables)
        assert "errors" in body, f"expected an error, got data: {body.get('data')}"
        return [str(e.get("extensions", {}).get("code")) for e in body["errors"]]

    def root_fields(self, operation: str = "query") -> set[str]:
        type_name = "queryType" if operation == "query" else "mutationType"
        data = self.data(f"{{ __schema {{ {type_name} {{ fields {{ name }} }} }} }}")
        node = data["__schema"][type_name]
        return {f["name"] for f in node["fields"]} if node else set()
