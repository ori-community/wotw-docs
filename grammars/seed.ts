import type { LanguageRegistration } from "shiki";

const seedLanguage: LanguageRegistration = {
  name: "seed",
  scopeName: "source.wotws",
  patterns: [
    { include: "#comment" },
    { include: "#keyword" },
    { include: "#type" },
    { include: "#constant" },
    { include: "#function" },
    { include: "#command" },
    { include: "#annotation" },
    { include: "#uberIdentifier" },
    { include: "#number" },
    { include: "#identifier" },
    { include: "#string" },
  ],
  repository: {
    $self: {},
    $base: {},
    comment: {
      match: "//[^\\n]*",
      name: "comment",
    },
    keyword: {
      patterns: [
        {
          match: "\\b(?:fun|true|false)\\b",
          name: "keyword.other",
        },
        {
          match: "\\b(?:on|change|if)\\b",
          name: "keyword.control",
        },
      ],
    },
    type: {
      patterns: [
        {
          match: "\\b(?:Boolean|Integer|Float|String)\\b",
          name: "entity.name.type",
        },
        {
          match: "(?::|->)\\s*(\\w+)",
          captures: {
            "1": {
              name: "entity.name.type",
            },
          },
        },
      ],
    },
    constant: {
      patterns: [
        {
          match:
            "\\b(?:spawn|reload|respawn|binding1|binding2|binding3|binding4|binding5|teleport|progress_message|tick|inkwater_trial_text_request|hollow_trial_text_request|wellspring_trial_text_request|woods_trial_text_request|reach_trial_text_request|depths_trial_text_request|luma_trial_text_request|wastes_trial_text_request)\\b",
          name: "variable.other.constant",
        },
        {
          match: "\\w+::\\w*",
          name: "variable.other.enummember",
        },
      ],
    },
    function: {
      match: "(\\w+)\\(",
      captures: {
        "1": {
          name: "entity.name.function",
        },
      },
    },
    command: {
      match: "!\\s*\\w*",
      name: "entity.name.function.preprocessor",
    },
    annotation: {
      match: "#\\s*\\w*",
      name: "entity.name.function.preprocessor",
    },
    uberIdentifier: {
      patterns: [
        {
          match: "\\d+\\|\\d+",
          name: "constant.numeric",
        },
        {
          match: "\\w+\\.\\w+",
          name: "constant.numeric",
        },
      ],
    },
    number: {
      match: "-?\\d+\\.?\\d*",
      name: "constant.numeric",
    },
    identifier: {
      match: "\\w+",
      name: "variable",
    },
    string: {
      begin: '"',
      end: '"',
      name: "string.quoted.double",
    },
  },
};

export default seedLanguage;
