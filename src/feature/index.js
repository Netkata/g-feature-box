/**
 * External dependencies
 */
import React from 'react';
import { element, i18n, components, editor } from 'wp';

/**
 * Internal dependencies
 */
import './style.scss';
import './editor.scss';
import defaultImage from './placeholder-16-9.png';

const { Fragment } = element;
const { __ } = i18n;

const {
    PanelBody,
    PanelRow,
    SelectControl,
    RangeControl,
    ToggleControl,
    Toolbar,
    IconButton,
    ToolbarButton,
} = components;
const {
    InspectorControls,
    PanelColorSettings,
    InnerBlocks,
    URLInput,
    BlockControls,
    MediaUpload,
    RichText,
    AlignmentToolbar,
} = editor;

const BLOCK_ATTRIBUTES = {
    content: {
        type: 'string',
        source: 'html',
        selector: 'h2,h3',
        default: '',
    },
    desc: {
        type: 'string',
    },
    level: {
        type: 'number',
        default: 2,
    },
    url: {
        type: 'string',
    },
    backgroundImage: {
        type: 'string',
    },
    backgroundImageId: {
        type: 'number',
    },
    backgroundImageAlt: {
        type: 'string',
    },
    backgroundPosition: {
        type: 'string',
        default: 'center',
    },
    backgroundSize: {
        type: 'string',
        default: 'cover',
    },
    backgroundColor: {
        type: 'string',
    },
    backgroundColorOpacity: {
        type: 'number',
        default: 10,
    },
    backgroundColorDisplay: {
        type: 'string',
        default: 'none',
    },
    image: {
        type: 'string',
        default: '',
    },
    imageId: {
        type: 'number',
    },
    alignment: {
        type: 'string',
    },
    hasBackground: {
        type: 'boolean',
        default: true,
    },
};

const BackgroundImage = ({ style }) => (
    <div className="wp-block-cloudblocks-feature-box__background-image" style={style} />
);

const BackgroundColor = ({ style }) => (
    <div className="wp-block-cloudblocks-feature-box__background-color" style={style} />
);

const TEMPLATE = [['core/paragraph', { placeholder: __('Short description') }]];

const ALLOWED_BLOCKS = ['core/paragraph', 'core/button'];

const bgPositionOptions = [
    { label: __('None'), value: '' },
    { label: __('Center'), value: 'center' },
    { label: __('Center Top'), value: 'center top' },
    { label: __('Center Bottom'), value: 'center bottom' },
    { label: __('Left Center'), value: 'left center' },
    { label: __('Right Center'), value: 'right center' },
];

const bgSizeOptions = [
    { label: __('None'), value: '' },
    { label: __('Cover'), value: 'cover' },
    { label: __('Contain'), value: 'contain' },
];

export const name = 'feature-box';

export const settings = {
    title: __('Feature Box'),

    description: __('Feature Box in which you can add short post content or feature article'),

    icon: 'cover-image',

    supports: {
        html: false,
    },

    attributes: BLOCK_ATTRIBUTES,

    edit ({ attributes, setAttributes, className, isSelected }) {
        const {
            level,
            url,
            content,
            backgroundImage,
            backgroundImageId,
            backgroundImageAlt,
            backgroundPosition,
            backgroundSize,
            backgroundColor,
            backgroundColorOpacity,
            backgroundColorDisplay,
            alignment,
            hasBackground,
        } = attributes;
        const styles = {
            textAlign: alignment,
        };
        const tagName = `h${level}`;

        const onSelectBgImage = ({
            id,
            sizes: {
                full: { url: imgURI },
            },
        }) => setAttributes({ backgroundImage: imgURI, backgroundImageId: id });

        const onRemoveBgImage = () => {
            setAttributes({
                backgroundImageId: null,
                backgroundImage: null,
            });
        };

        function onChangeAlignment(updatedAlignment) {
            setAttributes({ alignment: updatedAlignment });
        }

        const classes = [className];

        const inlineStyles = {
            background: 'url(' + defaultImage + ')',
        };

        let backgroundImgStyles = {
            backgroundImage: 'url(' + backgroundImage + ')',
            backgroundPosition: backgroundPosition,
            backgroundSize: backgroundSize,
        };

        let imageBlock;
        let backgroundClass = "wp-block-cloudblocks-feature-box--background";
        if(!hasBackground) {
            backgroundImgStyles = {};
            backgroundClass = "";

            imageBlock = (
                <div className="wp-block-cloudblocks-feature-box__image">
                    <img src={backgroundImage} alt={backgroundImageAlt} />
                </div>
            );
        }

        if(backgroundColor) {
            setAttributes({ backgroundColorDisplay: 'block' });
        }

        const backgroundColorStyles = {
            backgroundColor: backgroundColor,
            opacity: `${(backgroundColorOpacity * 0.1).toFixed(
                1
            )}`,
            display: backgroundColorDisplay,
        };

        return (
            <Fragment>
                <div className={classes.join(' ')} style={styles}>
                    {!backgroundImageId && (
                        <a className="wp-block-cloudblocks-feature-box__image wp-block-cloudblocks-feature-box__image--placeholder" style={inlineStyles}>
                            <MediaUpload
                                type="image"
                                onSelect={onSelectBgImage}
                                value={backgroundImageId}
                                render={({ open }) => (
                                    <IconButton
                                        className="wp-block-cloudblocks-feature-box__image-button"
                                        label={__('Add/Edit background image')}
                                        icon="format-image"
                                        onClick={open}
                                    />
                                )}
                            />
                        </a>
                    )}
                    {backgroundImageId && (
                        <div className={backgroundClass} style={backgroundImgStyles}>
                            <div className="wp-block-cloudblocks-feature-box--background-overlay" style={backgroundColorStyles}></div>

                            <div className="wp-block-cloudblocks-feature-box__background-icon">
                                <MediaUpload
                                    type="image"
                                    onSelect={onSelectBgImage}
                                    value={backgroundImageId}
                                    render={({ open }) => (
                                        <IconButton
                                            className="components-toolbar__control"
                                            label={__('Add/Edit background image')}
                                            icon="edit"
                                            onClick={open}
                                        />
                                    )}
                                />
                            </div>

                            <div className="wp-block-cloudblocks-feature-box__content">

                                {imageBlock}

                                <RichText
                                    placeholder={__('Title')}
                                    tagName={tagName}
                                    className="wp-block-cloudblocks-feature-box__title"
                                    value={content}
                                    isSelected={false}
                                    keepPlaceholderOnFocus={true}
                                    onChange={content => setAttributes({ content })}
                                />

                                <div className="wp-block-cloudblocks-feature-box__description">
                                    <InnerBlocks template={TEMPLATE} allowedBlocks={ALLOWED_BLOCKS} />
                                </div>
                            </div>

                        </div>
                    )}

                    {isSelected && (
                        <URLInput value={url} onChange={url => setAttributes({ url })} />
                    )}
                </div>
                <BlockControls>
                    <Toolbar>
                        <MediaUpload
                            type="image"
                            onSelect={onSelectBgImage}
                            value={backgroundImageId}
                            render={({ open }) => (
                                <IconButton
                                    className="components-toolbar__control"
                                    label={__('Add/Edit background image')}
                                    icon="format-image"
                                    onClick={open}
                                />
                            )}
                        />
                        {backgroundImageId && (
                            <ToolbarButton
                                title={__('Remove background image')}
                                icon="trash"
                                onClick={onRemoveBgImage}
                            />
                        )}
                        <ToolbarButton
                            icon="heading"
                            title={__('Level 2')}
                            isActive={level === 2}
                            onClick={level => setAttributes({ level: 2 })}
                            subscript="2"
                        />
                        <ToolbarButton
                            icon="heading"
                            title={__('Level 3')}
                            isActive={level === 3}
                            onClick={level => setAttributes({level: 3})}
                            subscript="3"
                        />
                    </Toolbar>
                    <AlignmentToolbar value={alignment} onChange={onChangeAlignment} />
                </BlockControls>
                <InspectorControls>
                    <PanelBody title={__('Image Settings')} initialOpen={true}>
                        <ToggleControl
                            label="Change image background to cover photo"
                            help={ hasBackground ? 'Has background image.' : 'Has cover image.' }
                            checked={ hasBackground }
                            onChange={ hasBackground => setAttributes({ hasBackground }) }
                        />
                    </PanelBody>
                    <PanelColorSettings
                        initialOpen={false}
                        title={__('Background Color')}
                        colorSettings={[
                            {
                                value: backgroundColor,
                                onChange: backgroundColor => {
                                    setAttributes({ backgroundColor });
                                },
                                label: __('Background Color'),
                            },
                        ]}
                    />
                    <PanelBody title={__('Background Settings')} initialOpen={false}>
                        <RangeControl
                            label={__('Background color opacity')}
                            value={backgroundColorOpacity}
                            onChange={backgroundColorOpacity =>
                                setAttributes({ backgroundColorOpacity })
                            }
                            min={1}
                            max={10}
                        />
                        <PanelRow>
                            <label htmlFor="bg-position">{__('Background Position')}</label>
                            <SelectControl
                                id="bg-position"
                                value={backgroundPosition}
                                options={bgPositionOptions}
                                onChange={backgroundPosition =>
                                    setAttributes({ backgroundPosition })
                                }
                            />
                        </PanelRow>
                        <PanelRow>
                            <label htmlFor="bg-size">{__('Background Size')}</label>
                            <SelectControl
                                id="bg-size"
                                value={backgroundSize}
                                options={bgSizeOptions}
                                onChange={backgroundSize => setAttributes({ backgroundSize })}
                            />
                        </PanelRow>
                    </PanelBody>
                </InspectorControls>
            </Fragment>
        );
    },

    save ({ attributes, className }) {
        const {
            level,
            url,
            content,
            backgroundImage,
            backgroundImageAlt,
            backgroundPosition,
            backgroundSize,
            backgroundColor,
            backgroundColorOpacity,
            backgroundColorDisplay,
            alignment,
            hasBackground,
        } = attributes;

        const styles = {
            textAlign: alignment,
        };
        const tagName = `h${level}`;

        const classes = [className, 'wp-block-cloudblocks-feature-box'];

        if (alignment) {
            classes.push(alignment);
        }

        let backgroundImgStyles = {
            backgroundImage: 'url(' + backgroundImage + ')',
            backgroundPosition: backgroundPosition,
            backgroundSize: backgroundSize,
        };

        let backgroundClass = "wp-block-cloudblocks-feature-box--background";
        if(!hasBackground) {
            backgroundImgStyles = {};
            backgroundClass = "";
        }

        const backgroundColorStyles = {
            backgroundColor: backgroundColor,
            opacity: `${(backgroundColorOpacity * 0.1).toFixed(
                1
            )}`,
            display: backgroundColorDisplay,
        };

        return (
            <div className={classes.join(' ')} style={styles}>
                {url && (
                    <a className="wp-block-cloudblocks-feature-box__link" href={url}>
                        <div className={backgroundClass} style={backgroundImgStyles}>
                            <div className="wp-block-cloudblocks-feature-box--background-overlay" style={backgroundColorStyles}></div>
                            <div className="wp-block-cloudblocks-feature-box__content">
                                {!hasBackground && (
                                    <img className="wp-block-cloudblocks-feature-box__image" src={backgroundImage} alt={backgroundImageAlt} />
                                )}

                                <RichText.Content
                                    className="wp-block-cloudblocks-feature-box__title"
                                    value={content}
                                    tagName={tagName}
                                />

                                <div className="wp-block-cloudblocks-feature-box__description">
                                    <InnerBlocks.Content />

                                    {hasBackground && (
                                        <p className="wp-block-cloudblocks-feature-box__text-link">{__('Read full story')}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </a>
                )}
                {!url && (
                    <div className={backgroundClass} style={backgroundImgStyles}>
                        <div className="wp-block-cloudblocks-feature-box--background-overlay" style={backgroundColorStyles}></div>
                        <div className="wp-block-cloudblocks-feature-box__content">
                            {!hasBackground && (
                                <figure className="wp-block-cloudblocks-feature-box__image">
                                    <img src={backgroundImage} alt={backgroundImageAlt} />
                                </figure>
                            )}

                            <RichText.Content
                                className="wp-block-cloudblocks-feature-box__title"
                                value={content}
                                tagName={tagName}
                            />

                            <div className="wp-block-cloudblocks-feature-box__description">
                                <InnerBlocks.Content />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    },
};
