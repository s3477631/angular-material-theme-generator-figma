<script>
    import styles from './styles.css';
    import { selectedTab } from "./store";

    const selectTab = (tab) => {
       selectedTab.update(n => n = tab);
    }

</script>
<div class="panel-buttons">
    <div class="{$selectedTab === 0 ? 'panel-button-switch' : 'panel-button-switch-unselected'}" on:click={() => selectTab(0)}>
        Color Palette
    </div>
    <div class="{$selectedTab === 1 ? 'panel-button-switch' : 'panel-button-switch-unselected'}" on:click={() => selectTab(1)}>
        Typography
    </div>
</div>
