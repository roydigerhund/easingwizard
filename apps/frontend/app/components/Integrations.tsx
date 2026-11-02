import { classNames } from '~/css/class-names';
import { paragraph } from '~/css/common-classes';
import { apiDocsUrl, codexPluginUrl, mcpLocalSetupUrl, mcpUrl, pluginUrl } from '~/data/globals';
import CopyableCode from './CopyableCode';
import IconTextButton from './IconTextButton';
import CommandLineIcon from './icons/CommandLineIcon';
import CurlyBracesIcon from './icons/CurlyBracesIcon';
import ExternalLinkIcon from './icons/ExternalLinkIcon';
import NodesIcon from './icons/NodesIcon';

const focusRing =
  'focus-visible:ring-2 focus-visible:ring-grdt-to focus-visible:ring-offset-4 focus-visible:ring-offset-zinc-950';
const iconClass = 'size-8 text-grdt-to drop-shadow-[0_0_0.5rem_var(--grdt-to)]';
const sectionClass = 'min-w-0 space-y-4';
const separatedSectionClass = classNames(
  sectionClass,
  'border-t border-zinc-800 pt-8 @4xl:border-t-0 @4xl:border-l @4xl:pt-0 @4xl:pl-8',
);
const textLink = classNames(
  'rounded-sm text-zinc-200 underline decoration-zinc-700 underline-offset-4 hover:text-grdt-to hover:decoration-grdt-to',
  focusRing,
);

function SetupLink({ text, href }: { text: string; href: string }) {
  return (
    <IconTextButton
      text={text}
      href={href}
      icon={<ExternalLinkIcon className="size-5 shrink-0" aria-hidden="true" />}
      isStaticButton
      target="_blank"
      rel="noopener noreferrer"
      className={classNames('w-fit max-w-full motion-reduce:transition-none', focusRing)}
    />
  );
}

export default function Integrations() {
  return (
    <section
      id="integrations"
      tabIndex={-1}
      aria-labelledby="integrations-title"
      className="@container scroll-mt-6 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-grdt-to focus-visible:ring-offset-8 focus-visible:ring-offset-zinc-950"
    >
      <h2 id="integrations-title" className="mb-6 text-xs font-normal tracking-widest text-zinc-500 uppercase">
        Use it anywhere
      </h2>
      <div className="grid grid-cols-1 gap-8 @4xl:grid-cols-[1.15fr_1fr_0.85fr]">
        <div className={sectionClass}>
          <div className="space-y-3">
            <NodesIcon className={iconClass} aria-hidden="true" />
            <h3 className="font-medium text-zinc-100">MCP Server</h3>
            <p className={paragraph}>Connect your AI assistant directly to Easing Wizard’s curve tools.</p>
          </div>
          <CopyableCode value={mcpUrl} label="MCP server URL" buttonText="Copy URL" />
          <p className="text-sm leading-relaxed text-zinc-400">No API key or local Node.js required.</p>
          <details id="mcp-setup" className="group scroll-mt-6">
            <summary
              id="mcp-setup-summary"
              className={classNames(
                'w-fit cursor-pointer rounded-sm text-sm font-medium text-zinc-200 marker:text-grdt-to hover:text-grdt-to',
                focusRing,
              )}
            >
              Setup instructions
            </summary>
            <div className="mt-5 space-y-6 text-sm">
              <p className={paragraph}>
                Add a remote MCP server in your assistant’s settings. Paste the URL above, choose Streamable HTTP if
                asked, and leave authentication empty.
              </p>
              <div className="space-y-3">
                <h4 className="font-medium text-zinc-100">Codex CLI</h4>
                <CopyableCode value={`codex mcp add easingwizard --url ${mcpUrl}`} label="Codex MCP command" />
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-zinc-100">Claude Code</h4>
                <CopyableCode
                  value={`claude mcp add --transport http --scope user easingwizard ${mcpUrl}`}
                  label="Claude Code MCP command"
                />
              </div>
              <p className={paragraph}>
                Choose one setup method. If you use an Easing Wizard plugin, its MCP server is already included.
              </p>
              <div className="space-y-2">
                <p className="font-medium text-zinc-100">Then try asking</p>
                <p className={paragraph}>
                  “Create a subtle spring easing for a dropdown, with CSS and a preview link.”
                </p>
              </div>
            </div>
          </details>
          <p className="text-sm leading-relaxed text-zinc-400">
            Prefer to run locally?{' '}
            <a className={textLink} href={mcpLocalSetupUrl} target="_blank" rel="noopener noreferrer">
              Set up with npm
            </a>
          </p>
        </div>
        <div className={separatedSectionClass}>
          <div className="space-y-3">
            <CommandLineIcon className={iconClass} aria-hidden="true" />
            <h3 className="font-medium text-zinc-100">Agent plugins</h3>
            <p className={paragraph}>
              Get curve recommendations, review animations, and improve CSS or Tailwind with guided workflows.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3">
            <SetupLink text="Claude Code setup" href={pluginUrl} />
            <SetupLink text="Codex setup" href={codexPluginUrl} />
          </div>
          <p className="text-sm leading-relaxed text-zinc-400">Skills and the MCP server, together in one plugin.</p>
        </div>
        <div className={separatedSectionClass}>
          <div className="space-y-3">
            <CurlyBracesIcon className={iconClass} aria-hidden="true" />
            <h3 className="font-medium text-zinc-100">REST API</h3>
            <p className={paragraph}>
              Generate curves in your app or build step. Get CSS, Tailwind classes, and SVG geometry as JSON.
            </p>
          </div>
          <SetupLink text="Read API docs" href={apiDocsUrl} />
        </div>
      </div>
    </section>
  );
}
