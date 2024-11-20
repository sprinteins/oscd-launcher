<script lang="ts">
    import Theme from "./theme/theme.svelte";
    import Button from "@smui/button"

</script>

<Theme>
    <launcher>
        OSCD Launcher
    </launcher>
</Theme>

<style>
    :root,
    :host {
        --header-height: 128px; 
    }

    launcher {
        height: calc(100vh - var(--header-height));
        align-content: center;
        position: relative;
        padding: 2em;
    }
</style>