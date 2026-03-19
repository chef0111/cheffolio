import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { companyLinks, companyLinks2, productLinks } from './nav-links';
import { LinkItem } from './sheard';

export function DesktopNav() {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem className="bg-transparent">
          <NavigationMenuTrigger className="bg-transparent">
            Product
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-muted/50 dark:bg-background p-1 pr-1.5">
            <div className="bg-popover grid w-lg grid-cols-2 gap-2 rounded-md border p-2 shadow">
              {productLinks.map((item, i) => (
                <NavigationMenuLink asChild key={`item-${item.label}-${i}`}>
                  <LinkItem {...item} />
                </NavigationMenuLink>
              ))}
            </div>
            <div className="p-2">
              <p className="text-muted-foreground text-sm">
                Interested?{' '}
                <a
                  className="text-foreground font-medium hover:underline"
                  href="#"
                >
                  Schedule a demo
                </a>
              </p>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">
            Company
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-muted/50 dark:bg-background p-1 pr-1.5 pb-1.5">
            <div className="grid w-lg grid-cols-2 gap-2">
              <div className="bg-popover space-y-2 rounded-md border p-2 shadow">
                {companyLinks.map((item, i) => (
                  <NavigationMenuLink asChild key={`item-${item.label}-${i}`}>
                    <LinkItem {...item} />
                  </NavigationMenuLink>
                ))}
              </div>
              <div className="space-y-2 p-3">
                {companyLinks2.map((item, i) => (
                  <NavigationMenuLink
                    href={item.href}
                    key={`item-${item.label}-${i}`}
                  >
                    {item.icon}
                    {item.label}
                  </NavigationMenuLink>
                ))}
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuLink asChild className="px-4">
          <a className="hover:bg-accent rounded-md p-2" href="#">
            Pricing
          </a>
        </NavigationMenuLink>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
