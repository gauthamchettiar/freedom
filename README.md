Freedom is a minimal, flexible Hugo theme built on a component-based architecture. It focuses on simplicity while providing powerful customization with minimal changes required to layout files.

## Key Features

- **Strong Markdown Support**: Has both basic and extended markdown syntax support. 
- **Component-Based**: Reusable partials and shortcodes, making it easier than ever to create custom layouts.
- **Highly Configurable**: Control features at page, section, or site level.
- **Dark Mode**: Built-in theme toggle  [ {{< icon "sun" >}} / {{< icon "moon" >}} ]  with system preference support.
- **Minimal & Fast**: Clean CSS with minimal JavaScript dependencies.
- **Semantic HTML**: Accessible markup with proper ARIA labels.

## Robust Configuration System

Freedom uses a hierarchical configuration system that resolves settings in this order:

1. **Page-level**: Front matter params in individual pages.
2. **Type → Section → Kind → Site level**: Using `hugo.yaml`.
3. **Defaults**: Built-in defaults

Nearly everything is configurable (you can have a blank page, with zero html just using configuration if you want), this makes it quite powerful to get the look you want even without needing to tweak with layout files. 


```yaml {display="hugo.yaml"}
params:
  section:
    usage:
      showPostListDate: false
      postListStyle: decimal
```

## Highly Customizable Theming

Override theme colors, fonts, and spacing by customizing CSS variables in your site's `assets/css/theme.css`:

```css {display="assets/css/theme.css"}
:root {
  --bg-color: #ffffff;
  --text-color: #222222;

  /* ... */
}

```

Or tweak look of a particular Page → Type → Section → Kind → Site using Freedom's configuration system:

```yaml {display="hugo.yaml"}
params:
  kind:
    home: # apply below theme only on home page
      theme:
        bgImage: "images/bg/light-marble.jpg"
        accentColor: "#FDDA0D"	
```

- **Dark Mode Support:** Most of the visual element has a dark-mode equivalent configuration. 
- **Typography Support:** Configure font styles for paragraph, heading or code.
- **Spacing & Layout Support:** Configure spacing and layout sizing based on t-shirt sizing. 
- **Background Image Support:** Go back to 90s, have an image as a background if you want.
- **Dark/Light Chroma Syntax Highlighting Support:** Dual chroma theme for dark/light mode, that can be configured to any style.

