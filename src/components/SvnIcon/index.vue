<template>
    <div v-if='isExternal' :style='styleExternalIcon' class='svg-external-icon svg-icon' />
    <svg v-else :class='svgClass' aria-hidden='true'>
        <use :xlink:href='iconName' />
    </svg>
</template>
<script lang='ts' setup name="SvgIcon">

const props = defineProps({
    iconClass: {
        type: String,
        required: true
    },
    className: {
        type: String,
        default: ''
    }
})

const isExternal = /^(https?:|mailto:|tel:)/.test(props.iconClass)
const iconName = `#icon-${props.iconClass}`
const svgClass = props.className ? `svg-icon ${props.className}` : 'svg-icon '
const styleExternalIcon = () => {
    return {
        mask: `url(${props.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${props.iconClass}) no-repeat 50% 50%`
    }
}

</script>

<style lang='postcss' scoped>
.svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}

.svg-external-icon {
    background-color: currentColor;
    mask-size: cover !important;
    display: inline-block;
}
</style>