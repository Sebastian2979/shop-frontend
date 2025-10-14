import React from 'react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

const AdminDropDown = () => {
  return (
    <div>
        <NavigationMenu className="bg-teal-500">
          <NavigationMenuList className="gap-2">
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/admin"
                className="text-white hover:text-white/70 font-semibold"
              >
                Admin
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/admin/orders"
                className="text-white hover:text-white/70 font-semibold"
              >
                Bestellungen
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/admin/category"
                className="text-white hover:text-white/70 font-semibold"
              >
                Kategorien
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-white hover:text-white/70 font-semibold">
                Produkte
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-transparent shadow-lg rounded-xl p-4 w-64">
                <ul className="w-[200px] space-y-2">
                  <li>
                    <NavigationMenuLink href="/admin/products" className="block px-3 py-2 rounded-lg hover:bg-transparent">
                      Alle Produkte
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink href="/admin/products/new" className="block px-3 py-2 rounded-lg hover:bg-transparent">
                      Neues Produkt anlegen
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
    </div>
  )
}

export default AdminDropDown