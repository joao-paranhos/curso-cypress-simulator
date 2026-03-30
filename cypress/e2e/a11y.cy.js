describe("Cypress Simulator - A11y Checks", () => {
  beforeEach(() => {
    cy.visit("./src/index.html?skipCaptcha=true", {
      onBeforeLoad(win) {
        win.localStorage.setItem("cookieConsent", "accepted")
      }
    })
    cy.contains("button", "Login").click()
    cy.injectAxe()
  })

  it('Sucesso na simulação de um comando do Cypress', () => {
      cy.get('#codeInput').type("cy.log('Yay!')")
      cy.get('#runButton').click()

      cy.get('#outputArea',{ timeout: 6000 })
      .should('contain.text',"Success:")
      .and('contain.text',"cy.log('Yay!') // Logged message 'Yay!'")
      .and('be.visible')


    })
    it('O erro ocorre ao inserir e executar um comando Cypress válido sem parênteses (por exemplo, cy.visit).', () => {
            
      cy.get('#codeInput').type("cy.visit")
      cy.get('#runButton').click()

      cy.get('#outputArea',{ timeout: 6000 })
      .should('contain','Error:')
      .and('contain',"Missing parentheses on `cy.visit` command")
      .and('be.visible')
    })
    it("Exibe um aviso ao inserir e executar um comando Cypress não implementado (por exemplo, cy.contains('Login')).", () => {
      
      cy.get('#codeInput').type("cy.contains('Login')")
      cy.get('#runButton').click()

      cy.get('#outputArea',{ timeout: 6000 })
      .should('contain','Warning:')
      .and('contain','The `cy.contains` command has not been implemented yet.')
      .and('be.visible')
    })
    it('Ele pede ajuda e obtém comandos e exemplos comuns do Cypress, com um link para a documentação.', () => {

      cy.get('#codeInput').type("help")
      cy.get('#runButton').click()

      cy.get('#outputArea',{ timeout: 6000 })
      .should('contain','Common Cypress commands and examples:')
      .and('contain',"For more commands and details, visit the official Cypress API documentation.")
      .and('be.visible')
      cy.contains('#outputArea a','official Cypress API documentation')
      .should('have.attr','href','https://docs.cypress.io/api/table-of-contents')
      .and('have.attr','target','_blank')
      .and('have.attr','rel','noopener noreferrer')
      .and('be.visible')
  

    })
    it('maximização/minimização', () => {

      cy.get('#codeInput').type("cy.log('Yay!')")
      cy.get('#runButton').click()
      cy.get('.expand-collapse').click()

      cy.get('#outputArea',{ timeout: 6000 })
      .should('contain.text',"Success:")
      .and('contain.text',"cy.log('Yay!') // Logged message 'Yay!'")
      .and('be.visible')
      cy.get('#collapseIcon').should('be.visible')
      cy.get('.expand-collapse').click()
      cy.get('#collapseIcon').should('not.be.visible')
    })
    it('Sucesso ao deslogar', () => {

      cy.get('.lucide.lucide-menu').click()
      cy.get('#logoutButton').click()

      cy.contains('button','Login').should('be.visible')
      cy.get('#sandwich-menu').should('not.be.visible')
    })
    it('exibe e esconde o botão de deslogar', () => {

      cy.get('#sandwich-menu').click()

      cy.get('#sandwich-menu').should('have.attr','aria-expanded','true')
      cy.contains('button','Logout').should('be.visible')
 

      cy.get('#sandwich-menu').click()

      cy.get('#sandwich-menu').should('have.attr','aria-expanded','false')
       cy.contains('button','Logout').should('not.be.visible')



    })
    it('Mostra o estado da execução antes de exibir o resultado final.', () => {

      cy.get('#codeInput').type("cy.log('Yay!')")
      cy.get('#runButton').click()

      cy.contains('button',' Running...')
      .should('be.visible')
      .and('be.disabled')

      cy.contains('#outputArea','Running... Please wait.').should('be.visible')

      cy.contains('button',' Running...',{ timeout: 6000 })
      .should('not.exist')

      cy.contains('button','Run')
      .should('be.visible')
      .and('be.enabled')

      cy.contains('#outputArea','Running... Please wait.').should('not.exist')
      
      cy.get('#outputArea')
      .should('contain.text',"Success:")
      .and('contain.text',"cy.log('Yay!') // Logged message 'Yay!'")
      .and('be.visible')

    })

    
 

    it.only('Isso desativa o botão de verificação do captcha quando nenhuma resposta é fornecida ou quando o captcha é apagado.',()=>{

    cy.contains('button','Verify')
    .as('botaoVerificacao')
    .should('be.disabled')

    cy.get('input[placeholder="Enter your answer"]')
    .as('Campoinput')
    .type('99')

    cy.get('@botaoVerificacao').should('be.enabled')

    cy.get('@Campoinput').clear()

    cy.contains('button','Verify')
    .as('botaoVerificacao')
    .should('be.disabled')
  })
   it('Aparece um erro referente a uma resposta incorreta do captcha e o sistema retorna ao seu estado inicial.',()=>{
  
     cy.get('input[placeholder="Enter your answer"]')
    .as('Campoinput')
    .type('99')

    cy.contains('button','Verify')
    .as('botaoVerificacao')
    .click()

    cy.contains('#captchaError','Incorrect answer, please try again.').should('be.visible')

    cy.get('input[placeholder="Enter your answer"]')
    .as('Campoinput')
    .should('have.text','')

    cy.contains('button','Verify')
    .as('botaoVerificacao')
    .should('be.disabled')

})

})

 describe('Cypress Simulator - Banner de consetimento de cookies', () => {

  beforeEach(() => {

    cy.visit("./src/index.html?skipCaptcha=true")
    cy.contains('button','Login').click()
})



      it('Ao utilizar cookies, você concorda com o seu uso.', () => {

      cy.get('#cookieConsent')
      .as('bannercookies')
      .find('button:contains(Accept)')
      .click()

      cy.get('@bannercookies').should('not.visible')
      cy.window().its('localStorage.cookieConsent').should('eq','accepted')
    })

    it('rejeita o uso dos cookies', () => {

      cy.get('#cookieConsent')
      .as('bannerCookies')
      .find('button:contains(Decline)')
      .click()

      cy.get('@bannerCookies').should('not.be.visible')

      cy.window().its('localStorage.cookieConsent')
      .should('eq','declined')


    })





})