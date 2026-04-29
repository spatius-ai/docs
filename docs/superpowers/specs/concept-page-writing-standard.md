# Concept Page Writing Standard

Use the Claude Code "How it works" style as the benchmark: concept pages should build a developer's mental model around the product's runtime mechanism, not read like an object encyclopedia or API inventory.

## Principles

- **Start from the runtime story.** Explain what happens at runtime and where this topic fits in that sequence. For Spatius, the central sequence is: avatar speech audio reaches Motion Server, Motion Server produces motion data, and AvatarKit renders locally.
- **Answer why the developer should care.** Every section should connect the concept to a decision, responsibility, failure mode, or debugging path. Avoid definitions that do not change what the developer does.
- **Prefer task-shaped sections over noun lists.** For example, on `Avatars`, prefer a story like `choose Avatar ID -> AvatarManager loads -> AvatarView mounts -> AvatarController controls runtime` over separate encyclopedia entries for every class.
- **Use only established product terms.** Do not invent labels like "AvatarKit render", "Spatius flow", "runtime loop", or other new conceptual nouns unless the term is intentionally added to `AGENT.md` naming conventions.
- **Make mode boundaries explicit.** If behavior differs across Basic Mode, Custom Mode, and LiveKit Plugin, say where the responsibility lives instead of describing Basic Mode behavior as universal.
- **Keep API detail out of Concepts.** Mention method or type names only as anchors for the mental model, then link to SDK Reference for exact signatures and platform-specific details.
- **End with practical navigation.** Add a short "Go next" or equivalent section that points readers to the next concept or reference page based on what they are trying to do.

## Recommended Shape

Concept pages do not need identical headings, but they should usually follow this order:

1. Define the topic in one or two sentences.
2. Place it in the runtime story.
3. Explain what the developer owns.
4. Explain what Spatius / AvatarKit / Motion Server owns.
5. Show the normal path or task sequence.
6. Call out failure modes and debugging entry points.
7. Link to the next relevant concept or SDK Reference page.

## Anti-Patterns

- Starting with platform-specific code tabs before the reader understands the concept.
- Listing SDK classes as independent dictionary entries without showing how they work together.
- Treating Basic Mode connection behavior as universal across all integration modes.
- Introducing a new named concept just to make a diagram label sound tidy.
- Repeating method signatures or enum definitions that belong in SDK Reference.
