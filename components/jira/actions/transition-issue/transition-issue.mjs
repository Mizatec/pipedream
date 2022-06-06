// legacy_hash_id: a_OOibX8
import { axios } from "@pipedream/platform";

export default {
  key: "jira-transition-issue",
  name: "Transition Issue",
  description: "Performs an issue transition and, if the transition has a screen, updates the fields from the transition screen.",
  version: "0.1.2",
  type: "action",
  props: {
    jira: {
      type: "app",
      app: "jira",
    },
    issueIdOrKey: {
      type: "string",
      description: "The ID or key of the issue to transition.",
    },
    transition: {
      type: "object",
      description: "Details of a transition.",
    },
    fields: {
      type: "object",
      description: "List of issue screen fields to update, specifying the sub-field to update and its value for each field. This field provides a straightforward option when setting a sub-field. When multiple sub-fields or other operations are required, use `update`. Fields included in here cannot be included in `update`.",
      optional: true,
    },
    update: {
      type: "object",
      description: "List of operations to perform on issue screen fields. Note that fields included in here cannot be included in fields.",
      optional: true,
    },
    hist_meta_type: {
      type: "string",
      description: "The type of the history record, part of the details in issue history metadata.",
      optional: true,
    },
    hist_meta_description: {
      type: "string",
      description: "The description of the history record, part of the details in issue history metadata.",
      optional: true,
    },
    hist_meta_descriptionKey: {
      type: "string",
      description: "The description key of the history record, part of the details in issue history metadata.",
      optional: true,
    },
    hist_meta_activityDescription: {
      type: "string",
      description: "The activity described in the history record, part of the details in issue history metadata.",
      optional: true,
    },
    hist_meta_activityDescriptionKey: {
      type: "string",
      description: "The key of the activity described in the history record, part of the details in issue history metadata.",
      optional: true,
    },
    hist_meta_emailDescription: {
      type: "string",
      description: "The description of the email address associated the history record, part of the details in issue history metadata.",
      optional: true,
    },
    hist_meta_emailDescriptionKey: {
      type: "string",
      description: "The description key of the email address associated the history record, part of the details in issue history metadata.",
      optional: true,
    },
    hist_meta_actor: {
      type: "object",
      description: "Details of the user whose action created the history record, part of the details in issue history metadata.",
      optional: true,
    },
    hist_meta_generator: {
      type: "object",
      description: "Details of the system that generated the history record, part of the details in issue history metadata.",
      optional: true,
    },
    hist_meta_cause: {
      type: "object",
      description: "Details of the cause that triggered the creation the history record, part of the details in issue history metadata.",
      optional: true,
    },
    hist_meta_extraData: {
      type: "object",
      description: "Additional arbitrary information about the history record, part of the details in issue history metadata.",
      optional: true,
    },
    hist_meta_additional_properties: {
      type: "object",
      description: "Extra properties of any type may be provided to this object.",
      optional: true,
    },
    properties: {
      type: "any",
      description: "Details of issue properties to be add or update.",
      optional: true,
    },
    additional_properties: {
      type: "object",
      description: "Extra properties of any type may be provided to this object.",
      optional: true,
    },
  },
  async run({ $ }) {
  // First we must make a request to get our the cloud instance ID tied
  // to our connected account, which allows us to construct the correct REST API URL. See Section 3.2 of
  // https://developer.atlassian.com/cloud/jira/platform/oauth-2-authorization-code-grants-3lo-for-apps/
    const resp = await axios($, {
      url: "https://api.atlassian.com/oauth/token/accessible-resources",
      headers: {
        Authorization: `Bearer ${this.jira.$auth.oauth_access_token}`,
      },
    });

    // Assumes the access token has access to a single instance
    const cloudId = resp[0].id;

    // See https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-transitions-get
    // for all options
    return await axios($, {
      url: `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${this.issueIdOrKey}/transitions`,
      headers: {
        "Authorization": `Bearer ${this.jira.$auth.oauth_access_token}`,
        "Accept": "application/json",
      },
      method: 'post',
      data: {
        "transition": this.transition,
        "fields": this.fields,
        "update": this.update,
        "historyMetadata": {
          "type": this.hist_meta_type,
          "description": this.hist_meta_description,
          "descriptionKey": this.hist_meta_descriptionKey,
          "activityDescription": this.hist_meta_activityDescription,
          "activityDescriptionKey": this.hist_meta_activityDescriptionKey,
          "emailDescription": this.hist_meta_emailDescription,
          "emailDescriptionKey": this.hist_meta_emailDescriptionKey,
          "actor": this.hist_meta_actor,
          "generator": this.hist_meta_generator,
          "cause": this.hist_meta_cause,
          "extraData": this.hist_meta_extraData,
          "Additional Properties": this.hist_meta_additional_properties,
        },
        "properties": this.properties,
        "Additional Properties": this.additional_properties,
      },
    });
  },
};
