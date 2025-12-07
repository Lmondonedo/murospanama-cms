import type { Schema, Struct } from '@strapi/strapi';

export interface ProductPricing extends Struct.ComponentSchema {
  collectionName: 'components_product_pricings';
  info: {
    displayName: 'Pricing';
  };
  attributes: {
    basePrice: Schema.Attribute.Decimal;
    bulkDiscount: Schema.Attribute.JSON;
    onSale: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    salePrice: Schema.Attribute.Decimal;
    unitType: Schema.Attribute.Enumeration<
      ['Unidad', 'Metro Lineal', 'Metro Cuadrado']
    >;
  };
}

export interface ProductProductOption extends Struct.ComponentSchema {
  collectionName: 'components_product_product_options';
  info: {
    displayName: 'ProductOption';
  };
  attributes: {
    optionName: Schema.Attribute.String & Schema.Attribute.Required;
    required: Schema.Attribute.Boolean;
    selectValues: Schema.Attribute.JSON;
  };
}

export interface ProductTechnicalDetail extends Struct.ComponentSchema {
  collectionName: 'components_product_technical_details';
  info: {
    displayName: 'TechnicalDetail';
    icon: 'bulletList';
  };
  attributes: {
    long: Schema.Attribute.String;
    material: Schema.Attribute.String & Schema.Attribute.Required;
    quantity: Schema.Attribute.Integer & Schema.Attribute.Required;
    section: Schema.Attribute.String & Schema.Attribute.Required;
    thickness: Schema.Attribute.String;
  };
}

export interface SharedGalerySlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_galery_sliders';
  info: {
    displayName: 'galery_slider';
    icon: 'dashboard';
  };
  attributes: {
    autoplay: Schema.Attribute.Boolean;
    image_item: Schema.Attribute.Component<'shared.images', true>;
    title: Schema.Attribute.String;
  };
}

export interface SharedIconBulletPoint extends Struct.ComponentSchema {
  collectionName: 'components_shared_icon_bullet_points';
  info: {
    displayName: 'Icon Bullet Point';
    icon: 'bulletList';
  };
  attributes: {
    text: Schema.Attribute.Text;
  };
}

export interface SharedImages extends Struct.ComponentSchema {
  collectionName: 'components_shared_images';
  info: {
    displayName: 'images';
  };
  attributes: {
    alternativeText: Schema.Attribute.String;
    caption: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface SharedStatBlock extends Struct.ComponentSchema {
  collectionName: 'components_shared_stat_blocks';
  info: {
    displayName: 'stat_block';
    icon: 'chartCircle';
  };
  attributes: {
    label: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'product.pricing': ProductPricing;
      'product.product-option': ProductProductOption;
      'product.technical-detail': ProductTechnicalDetail;
      'shared.galery-slider': SharedGalerySlider;
      'shared.icon-bullet-point': SharedIconBulletPoint;
      'shared.images': SharedImages;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'shared.stat-block': SharedStatBlock;
    }
  }
}
