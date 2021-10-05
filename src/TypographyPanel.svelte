<script>
    import CopyButton from './assets/copy-button.svg';
    import styles from './styles.css';
    import { onMount } from 'svelte';
    let paletteName = "";
    let colors = [];
    let colorPaletteContainer;
    let codeOutput;
    let hasCode = false;
    let notification;
    let selectedColorType;
    let colorTypes = [
       {id: 1, text: 'text'},
    ]

    onMount(async () => {
       window.onmessage = async (event) => {
          filterMessage(event)
       }
    });


    const addCode = (message) => {
       let textNode = document.createTextNode(message.toString());
       textNode.className = 'codeColor'
       codeOutput.appendChild(textNode)
       hasCode = true;
    }

    const filterMessage = (event) => {
       const message = JSON.parse(event.data.pluginMessage)
       if (Object.keys(message).toString() == "color") {
          colors = [...colors, Object.values(message).toString()];
       } else {
          addCode(Object.values(message))
       }
    }

    const copyCode = () => {
       let sel = document.getSelection();
       let range = document.createRange(); //range object
       range.selectNodeContents(codeOutput); //sets Range
       sel.removeAllRanges(); //remove all ranges from selection
       sel.addRange(range);//add Range to a Selection.
       document.execCommand("copy")
       notification.classList.toggle('copied-notification')
       setTimeout(() => {
          notification.classList.toggle('copied-notification')
       }, 1500)
    }


    const generateSheet = () => {
       const colorElements = colorPaletteContainer.children
       const colors = {};
       const palette = {};
       let i = 0;
       for (let item of colorElements) {
          if (i == 0) {
             i = 50
             colors[i] = item.value
             i = 100
          } else {
             colors[i] = item.value
             i += 100;
          }
       };
       if (paletteName == "") {
          palette['defaultTheme'] = colors;
       } else {
          palette[paletteName] = colors;
       }
       const updatePalette = {
          paletteUpdate: palette
       }
       parent.postMessage({pluginMessage: JSON.stringify(updatePalette)}, '*')
    }

    const clearSelected = () => {
       colors = [];
       codeOutput.innerHTML = "";
       paletteName = "";
       hasCode = false;
    }
    const updateSelectableColor = () => {
       const updateSelectable = {
          selectableType: selectedColorType.text
       }
       parent.postMessage({pluginMessage: JSON.stringify(updateSelectable)}, '*')
    }


</script>
<div class="wrapper p-xxsmall">
   <div class="generate-button-container">
      <input placeholder="Name typography"
             bind:value={paletteName} class="palette-input" type="text"/>
      <select class="palette-input"  bind:value={selectedColorType} on:change={updateSelectableColor} >
         {#each colorTypes as colors}
            <option selected={selectedColorType === colors.id} value={colors}>
               {colors.text}
            </option>
         {/each}
      </select>
      <div class="spacer"></div>
      <div style="display: flex; flex-direction: column;">
         <div class="notification notification-hide"
              bind:this={notification}>Copied!</div>
         <button class="copy-button" on:click={copyCode}>
            {@html CopyButton}
         </button>
      </div>
      <button class="clear-button" on:click={clearSelected}>Clear</button>
      <button class="generate-button" on:click={generateSheet}>Generate</button>
   </div>
    <div class=" {hasCode === true ? 'show-code' : 'hide-code'}">
        <span>Code:</span>
        <div class="code-output" bind:this={codeOutput}></div>
        <span>Preview:  </span>
    </div>
    <div class="stylesheet-container" bind:this={colorPaletteContainer}>
        <!--{#each colors as color (color)}-->
        <!--    <input type="color" class="color-picker" value={color}/>-->
        <!--{/each}-->
    </div>
</div>
