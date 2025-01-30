function processHeadingId(buffer, matches, state) {
  const [, content, id] = matches;

  const token = new state.Token("text", "", 0);
  token.content = content;
  buffer.push(token);

  state.env.headingCounter ||= 0;
  state.env.customIds ||= {};
  state.env.customIds[state.env.headingCounter++] = id;
}

function cleanupAutomaticAnchor(anchor, customId) {
  anchor.attrs = anchor.attrs.map(([attr, value]) => {
    if (attr !== "name" && attr !== "href") {
      return [attr, value];
    }

    const baseValue = value.startsWith("#") ? value.slice(1) : value;
    const cleanValue = baseValue.replace("-" + customId, "");

    return [attr, attr === "href" ? "#" + cleanValue : cleanValue];
  });
}

function createCustomAnchor(state, customId) {
  const linkOpen = new state.Token("link_open", "a", 1);
  const linkClose = new state.Token("link_close", "a", -1);

  linkOpen.attrSet("name", customId);
  linkOpen.attrSet("class", "custom-anchor-id");
  linkOpen.attrSet("href", "#" + customId);

  return [linkOpen, linkClose];
}

function processAnchor(state) {
  if (!state.env.customIds) {
    return;
  }

  let headingCounter = 0;

  for (let idx = 0; idx < state.tokens.length; idx++) {
    if (state.tokens[idx].type !== "heading_open") {
      continue;
    }

    const customId = state.env.customIds[headingCounter++];
    if (!customId) {
      continue;
    }

    const contentToken = state.tokens[idx + 1];
    if (!contentToken?.children) {
      continue;
    }

    // Clean up automatic anchor if it exists
    const existingAnchor = contentToken.children.find(
      (token) =>
        token.type === "link_open" &&
        token.attrs?.find(([attr, val]) => attr === "class" && val === "anchor")
    );

    if (existingAnchor) {
      cleanupAutomaticAnchor(existingAnchor, customId);
    }

    // Add custom anchor
    const [linkOpen, linkClose] = createCustomAnchor(state, customId);
    contentToken.children.unshift(linkClose);
    contentToken.children.unshift(linkOpen);
  }
}

export function setup(helper) {
  helper.registerOptions((opts) => {
    opts.features["anchor-custom-id"] = true;
  });

  helper.allowList(["a.custom-anchor-id"]);

  helper.registerPlugin((md) => {
    md.core.textPostProcess.ruler.push("heading-ids", {
      matcher: /(^.+?)\s*{#([^}]+)}\s*$/,
      onMatch: processHeadingId,
    });
    md.core.ruler.push("anchor-custom-id", processAnchor);
  });
}
