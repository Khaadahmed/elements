import '@testing-library/jest-dom';

import { NodeType } from '@stoplight/types';
import { render, screen } from '@testing-library/react';
import * as React from 'react';

import { IntegrationKind } from '../../types';
import { MarkdownViewer } from '.';
import { MarkdownComponentsProvider } from './CustomComponents/Provider';
import { createResolvedImageComponent } from './CustomComponents/ResolvedImage';

describe('MarkdownViewer', () => {
  describe('with ResolvedImage', () => {
    const common = {
      id: 54234624,
      data: 'some data',
      type: NodeType.Article,
      name: 'Some Article',
      uri: '/docs/some-article.md',
      summary: 'some summary',
      branchSlug: 'master',
      workspaceIntegration: {
        kind: IntegrationKind.Github,
        apiUrl: 'https://api.github.com',
        hostUrl: 'https://github.com',
      },
      externalOrgSlug: 'organisation',
      externalSlug: 'project',
    };

    it.each([
      [
        IntegrationKind.Github,
        {
          ...common,
          workspaceIntegration: {
            kind: IntegrationKind.Github,
            apiUrl: 'https://api.github.com',
            hostUrl: 'https://github.com',
          },
        },
        'https://raw.github.com/organisation/project/master/common/images/icon48.png',
      ],

      [
        IntegrationKind.Gitlab,
        {
          ...common,
          workspaceIntegration: {
            kind: IntegrationKind.Gitlab,
            apiUrl: 'https://api.gitlab.com',
            hostUrl: 'https://gitlab.com',
          },
        },
        'https://gitlab.com/organisation/project/raw/master/common/images/icon48.png',
      ],

      [
        IntegrationKind.Gitea,
        {
          ...common,
          workspaceIntegration: {
            kind: IntegrationKind.Gitea,
            apiUrl: 'https://api.gitea.com',
            hostUrl: 'https://gitea.com',
          },
        },
        'https://gitea.com/organisation/project/raw/branch/master/common/images/icon48.png',
      ],

      [
        IntegrationKind.BitbucketServer,
        {
          ...common,
          workspaceIntegration: {
            kind: IntegrationKind.BitbucketServer,
            apiUrl: 'https://api.bitbucket.com',
            hostUrl: 'https://bitbucket.com',
          },
        },
        'https://api.bitbucket.com/projects/organisation/repos/project/browse/common/images/icon48.png?raw=',
      ],

      [
        IntegrationKind.BitbucketCloud,
        {
          ...common,
          workspaceIntegration: {
            kind: IntegrationKind.BitbucketCloud,
            apiUrl: 'https://api.bitbucket.com',
            hostUrl: 'https://bitbucket.com',
          },
        },
        'https://bitbucket.com/organisation/project/raw/master/common/images/icon48.png',
      ],
    ])('resolves relative image url for integration with %s', (_, branchNode, expectedUrl) => {
      render(
        <MarkdownComponentsProvider value={{ image: createResolvedImageComponent(branchNode) }}>
          <MarkdownViewer markdown={`![alt text](../../common/images/icon48.png "Logo Title Text 1")`} />
        </MarkdownComponentsProvider>,
      );

      const image = screen.getByTitle('Logo Title Text 1');

      expect(image).toHaveAttribute('src', expectedUrl);
    });
  });
});
