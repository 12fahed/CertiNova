from certinova_api.actions import batches, legacy, orgs, verify
from certinova_api.hasura.registry import ActionRegistry


def build_registry() -> ActionRegistry:
    registry = ActionRegistry()
    for module in (orgs, batches, verify, legacy):
        registry.register(module.ACTIONS)
    return registry
