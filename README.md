# Discourse Custom Anchor ID

A Discourse plugin that allows you to specify custom IDs for heading anchors using a simple markdown syntax.

## Description

This plugin enables you to add custom IDs to your heading anchors in Discourse, making it easier to create stable links to specific sections of your posts. It works alongside Discourse's automatic heading anchors, providing both compatibility and flexibility.

## Usage

Add custom IDs to your headings using the `{#my_id}` syntax:

```markdown
## My Heading {#custom_section}
```
It will be generate:

```html
<a name="custom_section" href="#custom_section" class="custom-anchor-id"></a>
```
