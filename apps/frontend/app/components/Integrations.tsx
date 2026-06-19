import { Fragment } from 'react';
import { classNames } from '~/css/class-names';
import { paragraph } from '~/css/common-classes';
import { apiDocsUrl, mcpNpmUrl, pluginUrl } from '~/data/globals';
import CardHeadline from './CardHeadline';
import CommandLineIcon from './icons/CommandLineIcon';
import CurlyBracesIcon from './icons/CurlyBracesIcon';
import ExternalLinkIcon from './icons/ExternalLinkIcon';
import NodesIcon from './icons/NodesIcon';
import IconTextButton from './IconTextButton';

const integrations = [
  {
    title: 'REST API',
    description: 'Generate any curve straight from your backend or build step — JSON, plain CSS, or SVG.',
    Icon: CurlyBracesIcon,
    buttonText: 'Read the Docs',
    url: apiDocsUrl,
  },
  {
    title: 'MCP Server',
    description: 'Give Claude, Cursor, or VS Code direct access to curve generation, right in the chat.',
    Icon: NodesIcon,
    buttonText: 'Get it on npm',
    url: mcpNpmUrl,
  },
  {
    title: 'Claude Code Plugin',
    description: 'Recommend, improve, and audit easings without leaving your editor.',
    Icon: CommandLineIcon,
    buttonText: 'Install Plugin',
    url: pluginUrl,
  },
];

export default function Integrations() {
  return (
    <div className="@container">
      <CardHeadline>Use it anywhere</CardHeadline>
      <div className="items-stretch @3xl:flex">
        {integrations.map(({ title, description, Icon, buttonText, url }, index) => (
          <Fragment key={title}>
            {index > 0 && (
              <>
                <hr
                  className="my-8 border-t border-zinc-700 @3xl:hidden"
                  style={{ maskImage: 'linear-gradient(to right,rgba(0,0,0,1),rgba(0,0,0,0.1))' }}
                />
                <div
                  className="mx-8 hidden w-px border-l border-zinc-700 @3xl:block"
                  style={{ maskImage: 'linear-gradient(to bottom,rgba(0,0,0,1),rgba(0,0,0,0.1))' }}
                />
              </>
            )}
            <div className="flex flex-1 flex-col gap-3 items-start">
              <Icon className="size-8 text-grdt-to drop-shadow-[0_0_0.5rem_var(--grdt-to)]" />
              <h3 className="font-medium text-zinc-100">{title}</h3>
              <p className={classNames(paragraph, 'flex-1')}>{description}</p>
              <IconTextButton
                text={buttonText}
                icon={<ExternalLinkIcon className="size-5" />}
                isStaticButton
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
